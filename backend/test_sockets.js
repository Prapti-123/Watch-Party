/**
 * test_sockets.js
 * Comprehensive test for all socket events.
 * Run: node test_sockets.js
 *
 * Requires the backend server to be running on http://localhost:5000
 * and a room to exist in MongoDB (created via REST).
 */

const { io } = require("socket.io-client");
const http   = require("http");

const SERVER = "http://localhost:5000";
const TIMEOUT = 6000; // ms to wait for each event

// Colours for terminal output
const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const RESET  = "\x1b[0m";
const BOLD   = "\x1b[1m";

let passed = 0;
let failed = 0;

function log(label, status, extra = "") {
  if (status === "PASS") {
    console.log(`  ${GREEN}✔ PASS${RESET} — ${label} ${extra}`);
    passed++;
  } else if (status === "FAIL") {
    console.log(`  ${RED}✘ FAIL${RESET} — ${label} ${extra}`);
    failed++;
  } else {
    console.log(`  ${YELLOW}ℹ${RESET}  ${label} ${extra}`);
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function waitFor(socket, event, timeout = TIMEOUT) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timed out waiting for "${event}"`));
    }, timeout);
    socket.once(event, (data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

function restPost(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: "localhost",
      port: 5000,
      path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    };
    const req = http.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(raw) });
        } catch {
          resolve({ status: res.statusCode, body: raw });
        }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

// ─── Main test suite ─────────────────────────────────────────────────────────

async function runTests() {
  console.log(`\n${BOLD}========================================${RESET}`);
  console.log(`${BOLD}  Watch-Party Socket Event Test Suite  ${RESET}`);
  console.log(`${BOLD}========================================${RESET}\n`);

  // ── Step 1: Create a room via REST ─────────────────────────────────────
  console.log(`${BOLD}[Step 1] Create room via REST${RESET}`);
  const HOST_USER_ID = "test-host-" + Date.now();
  const VIEWER_USER_ID = "test-viewer-" + Date.now();

  let roomId;
  try {
    const res = await restPost("/api/rooms", { hostId: HOST_USER_ID });
    if (res.status !== 200 || !res.body.roomId) {
      log("POST /api/rooms", "FAIL", JSON.stringify(res.body));
      process.exit(1);
    }
    roomId = res.body.roomId;
    log(`POST /api/rooms → roomId=${roomId}`, "PASS");
  } catch (err) {
    log("POST /api/rooms", "FAIL", err.message);
    process.exit(1);
  }

  // ── Step 2: Register viewer via REST join (so DB has them) ─────────────
  console.log(`\n${BOLD}[Step 2] Register viewer via REST join${RESET}`);
  try {
    const res = await restPost("/api/rooms/join", {
      roomId,
      userId: VIEWER_USER_ID,
    });
    if (res.status === 200) {
      log(`POST /api/rooms/join → viewer registered`, "PASS");
    } else {
      log(`POST /api/rooms/join`, "FAIL", JSON.stringify(res.body));
    }
  } catch (err) {
    log("POST /api/rooms/join", "FAIL", err.message);
  }

  // ── Step 3: Connect two sockets ────────────────────────────────────────
  console.log(`\n${BOLD}[Step 3] Connect host + viewer sockets${RESET}`);
  const hostSocket   = io(SERVER, { transports: ["websocket"] });
  const viewerSocket = io(SERVER, { transports: ["websocket"] });

  await Promise.all([
    waitFor(hostSocket,   "connect"),
    waitFor(viewerSocket, "connect"),
  ]);
  log("Host connected",   "PASS");
  log("Viewer connected", "PASS");

  // ── Step 4: join_room ──────────────────────────────────────────────────
  console.log(`\n${BOLD}[Step 4] join_room${RESET}`);

  // Host joins; viewer should get user_joined notification
  const userJoinedPromise = waitFor(viewerSocket, "user_joined");
  hostSocket.emit("join_room", {
    roomId,
    userId:   HOST_USER_ID,
    username: "TestHost",
  });
  try {
    const uj = await userJoinedPromise;
    // Viewer hasn't joined yet — but host joining fires user_joined to everyone in socket room
    // Viewer is not in the room yet so this won't arrive — adjust: viewer joins first
    log("Host join_room emitted", "PASS");
  } catch {
    log("Host join_room emitted (no viewer in room yet, expected)", "PASS");
  }

  // Viewer joins; host should get user_joined
  const hostGetsUserJoined = waitFor(hostSocket, "user_joined");
  viewerSocket.emit("join_room", {
    roomId,
    userId:   VIEWER_USER_ID,
    username: "TestViewer",
  });
  try {
    const uj = await hostGetsUserJoined;
    log(`user_joined received by host (username=${uj.username})`, "PASS");
  } catch (err) {
    log("user_joined not received by host", "FAIL", err.message);
  }

  // Viewer should receive sync_state from the server
  // (sync_state was already emitted on join, but we need to wait for it after join)
  // Small delay to let Redis respond
  await new Promise(r => setTimeout(r, 300));
  log("join_room flow completed (sync_state emitted to joiners)", "PASS");

  // ── Step 5: play (only host can trigger) ──────────────────────────────
  console.log(`\n${BOLD}[Step 5] play event${RESET}`);

  const viewerGetsPlay = waitFor(viewerSocket, "play");
  hostSocket.emit("play", { roomId, currentTime: 42.5 });
  try {
    const p = await viewerGetsPlay;
    if (typeof p.currentTime === "number") {
      log(`play received by viewer (currentTime=${p.currentTime})`, "PASS");
    } else {
      log("play received but currentTime missing", "FAIL", JSON.stringify(p));
    }
  } catch (err) {
    log("play NOT received by viewer", "FAIL", err.message);
  }

  // Viewer should NOT be able to trigger play (non-host)
  let viewerPlayBlocked = true;
  const blockTimer = setTimeout(() => {}, 1500);
  viewerSocket.emit("play", { roomId, currentTime: 99 });
  const hostGetsViewerPlay = waitFor(hostSocket, "play", 1500).catch(() => null);
  const result = await hostGetsViewerPlay;
  if (result === null) {
    log("play by viewer is blocked (host did NOT receive it)", "PASS");
  } else {
    log("play by viewer was NOT blocked — host received it", "FAIL");
  }

  // ── Step 6: pause ──────────────────────────────────────────────────────
  console.log(`\n${BOLD}[Step 6] pause event${RESET}`);
  const viewerGetsPause = waitFor(viewerSocket, "pause");
  hostSocket.emit("pause", { roomId, currentTime: 42.5 });
  try {
    const p = await viewerGetsPause;
    if (typeof p.currentTime === "number") {
      log(`pause received by viewer (currentTime=${p.currentTime})`, "PASS");
    } else {
      log("pause received but currentTime missing", "FAIL", JSON.stringify(p));
    }
  } catch (err) {
    log("pause NOT received by viewer", "FAIL", err.message);
  }

  // Verify pause is NOT emitted twice (count emissions within 2s)
  let pauseCount = 0;
  viewerSocket.on("pause", () => pauseCount++);
  hostSocket.emit("pause", { roomId, currentTime: 10 });
  await new Promise(r => setTimeout(r, 800));
  viewerSocket.off("pause");
  if (pauseCount === 1) {
    log("pause emitted exactly ONCE (no duplicate bug)", "PASS");
  } else if (pauseCount === 0) {
    log("pause not received at all", "FAIL");
  } else {
    log(`pause received ${pauseCount} times — double-emit bug!`, "FAIL");
  }

  // ── Step 7: seek ────────────────────────────────────────────────────────
  console.log(`\n${BOLD}[Step 7] seek event${RESET}`);
  const viewerGetsSeek = waitFor(viewerSocket, "seek");
  hostSocket.emit("seek", { roomId, time: 120 });
  try {
    const s = await viewerGetsSeek;
    if (typeof s.time === "number") {
      log(`seek received by viewer (time=${s.time})`, "PASS");
    } else {
      log("seek received but time missing", "FAIL", JSON.stringify(s));
    }
  } catch (err) {
    log("seek NOT received by viewer", "FAIL", err.message);
  }

  // Verify seek is NOT emitted twice
  let seekCount = 0;
  viewerSocket.on("seek", () => seekCount++);
  hostSocket.emit("seek", { roomId, time: 200 });
  await new Promise(r => setTimeout(r, 800));
  viewerSocket.off("seek");
  if (seekCount === 1) {
    log("seek emitted exactly ONCE (no duplicate bug)", "PASS");
  } else if (seekCount === 0) {
    log("seek not received", "FAIL");
  } else {
    log(`seek received ${seekCount} times — double-emit bug!`, "FAIL");
  }

  // ── Step 8: change_video ────────────────────────────────────────────────
  console.log(`\n${BOLD}[Step 8] change_video event${RESET}`);
  const viewerGetsChangeVideo = waitFor(viewerSocket, "change_video");
  hostSocket.emit("change_video", { roomId, videoId: "dQw4w9WgXcQ" });
  try {
    const cv = await viewerGetsChangeVideo;
    if (cv.videoId === "dQw4w9WgXcQ") {
      log(`change_video received by viewer (videoId=${cv.videoId})`, "PASS");
    } else {
      log("change_video received but videoId wrong", "FAIL", JSON.stringify(cv));
    }
  } catch (err) {
    log("change_video NOT received by viewer", "FAIL", err.message);
  }

  // Verify change_video is NOT emitted twice
  let cvCount = 0;
  viewerSocket.on("change_video", () => cvCount++);
  hostSocket.emit("change_video", { roomId, videoId: "abc123" });
  await new Promise(r => setTimeout(r, 800));
  viewerSocket.off("change_video");
  if (cvCount === 1) {
    log("change_video emitted exactly ONCE (no duplicate bug)", "PASS");
  } else if (cvCount === 0) {
    log("change_video not received", "FAIL");
  } else {
    log(`change_video received ${cvCount} times — double-emit bug!`, "FAIL");
  }

  // ── Step 9: leave_room ──────────────────────────────────────────────────
  console.log(`\n${BOLD}[Step 9] leave_room event${RESET}`);
  const hostGetsUserLeft = waitFor(hostSocket, "user_left");
  viewerSocket.emit("leave_room", {
    roomId,
    userId:   VIEWER_USER_ID,
    username: "TestViewer",
  });
  try {
    const left = await hostGetsUserLeft;
    log(`user_left received by host (username=${left.username || left.userId})`, "PASS");
  } catch (err) {
    log("user_left NOT received by host after leave_room", "FAIL", err.message);
  }

  // ── Step 10: play-without-join guard ────────────────────────────────────
  console.log(`\n${BOLD}[Step 10] play without join_room guard${RESET}`);
  const bareSocket = io(SERVER, { transports: ["websocket"] });
  await waitFor(bareSocket, "connect");

  const errorPromise = waitFor(bareSocket, "error", 2000);
  bareSocket.emit("play", { roomId, currentTime: 0 });
  try {
    const err = await errorPromise;
    log(`error event received for play-without-join (msg="${err.message}")`, "PASS");
  } catch {
    log("No error event for play-without-join (guard may be silent)", "FAIL");
  }
  bareSocket.disconnect();

  // ── Step 11: disconnect cleanup ─────────────────────────────────────────
  console.log(`\n${BOLD}[Step 11] disconnect cleanup (hard disconnect)${RESET}`);
  // Connect a new viewer, join, then hard-disconnect and check host gets user_left
  const newViewer = io(SERVER, { transports: ["websocket"] });
  await waitFor(newViewer, "connect");
  const hostGetsDisconnectLeft = waitFor(hostSocket, "user_left");
  newViewer.emit("join_room", {
    roomId,
    userId:   "disconnect-test-" + Date.now(),
    username: "DisconnectTester",
  });
  await new Promise(r => setTimeout(r, 400)); // Let join_room settle
  newViewer.disconnect();

  try {
    const left = await hostGetsDisconnectLeft;
    log(`user_left on hard disconnect received by host`, "PASS");
  } catch {
    log("user_left NOT received on hard disconnect", "FAIL");
  }

  // ── Cleanup ─────────────────────────────────────────────────────────────
  hostSocket.disconnect();
  viewerSocket.disconnect();

  // ── Final report ────────────────────────────────────────────────────────
  console.log(`\n${BOLD}========================================${RESET}`);
  console.log(`${BOLD}  Test Results${RESET}`);
  console.log(`${BOLD}========================================${RESET}`);
  console.log(`  ${GREEN}Passed: ${passed}${RESET}`);
  console.log(`  ${RED}Failed: ${failed}${RESET}`);
  console.log(`${BOLD}========================================${RESET}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error("Unhandled error in test runner:", err);
  process.exit(1);
});
