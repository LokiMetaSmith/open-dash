// ---------------------------  OPEN-AUTOMATION -------------------------------- //
// --------------  https://github.com/physiii/open-automation  ----------------- //
// ----------------------------- dashboard.js ---------------------------------- //

var gui = require("nw.gui");
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var fs = require('fs');
var ping = require('ping');
//var exec = require('exec');

// Extend application menu for Mac OS
if (process.platform == "darwin") {
  var menu = new gui.Menu({type: "menubar"});
  menu.createMacBuiltin && menu.createMacBuiltin(window.document.title);
  gui.Window.get().menu = menu;
}

function updateCheckbox() {
  var top_checkbox = document.getElementById("top-box");
  var bottom_checkbox = document.getElementById("bottom-box");
  var left_checkbox = document.getElementById("left-box");
  var right_checkbox = document.getElementById("right-box");
  if (top_checkbox.checked || bottom_checkbox.checked) {
    left_checkbox.disabled = true;
    right_checkbox.disabled = true;
  } else if (left_checkbox.checked || right_checkbox.checked) {
    top_checkbox.disabled = true;
    bottom_checkbox.disabled = true;
  } else {
    left_checkbox.disabled = false;
    right_checkbox.disabled = false;
    top_checkbox.disabled = false;
    bottom_checkbox.disabled = false;
  }
}

function initCheckbox(checkboxId, titlebar_name, titlebar_icon_url, titlebar_text) {
  var elem = document.getElementById(checkboxId);
  if (!elem)
    return;
  elem.onclick = function() {
    if (document.getElementById(checkboxId).checked)
      addTitlebar(titlebar_name, titlebar_icon_url, titlebar_text);
    else
      removeTitlebar(titlebar_name);
    focusTitlebars(true);

    updateContentStyle();
    updateCheckbox();
  }
}

window.onfocus = function() { 
  console.log("focus");
  focusTitlebars(true);
};

window.onblur = function() { 
  console.log("blur");
  focusTitlebars(false);
};

window.onresize = function() {
  updateContentStyle();
};

var vnc_ip = "192.168.0.16";


var vnc_client;
vnc_started = false;
function start_vnc() {
  if (vnc_started) return;
  vnc_started = true;
  vnc_client = spawn('vinagre', ['-f', '192.168.0.16::5900']);
  vnc_client.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  vnc_client.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  vnc_client.on('close', function (code) {
    console.log('child process exited with code ' + code);
  });

/*  exec("vinagre -f 192.168.0.16::5900", function(err, out, code) {
    if (err instanceof Error)
      throw err;
    console.log("started vnc");
    vnc_started = true;
    process.stderr.write(err);
    process.stdout.write(out);
    process.exit(code);
  });*/
}

function close_vnc() {
  if (!vnc_started) return;
  vnc_client.kill();
  vnc_started = false;
  /*exec("pkill vinagre", function(err, out, code) {
    if (err instanceof Error)
      throw err;
    console.log("closed vnc");
    vnc_started = false;
    process.stderr.write(err);
    process.stdout.write(out);
    process.exit(code);
  });*/
}

timeout();
function timeout() {
  setTimeout(function () {
    console.log("checking mdd connection...")
    check_mdd_conn();
    timeout();
  }, 1*1000);
}


function check_mdd_conn() {

    ping.sys.probe(vnc_ip, function(isAlive){
        var msg = isAlive ? 'host ' + vnc_ip + ' is alive' : 'host ' + vnc_ip + ' is dead';
        //console.log(msg);
        if (isAlive) {
	  start_vnc();
        }

        if (!isAlive) {
	  close_vnc();
        }
    });

}


const express = require('express')
const app = express()

app.get('/mdd', function(req, res) { 
  res.send('Hello MDD!') 
});

app.get('/switch-to-vnc', function(req, res) {
  start_vnc();
  res.send('Hello MDD!');
})
app.listen(3000, function() {console.log('Example app listening on port 3000!')})



window.onload = function() {

  document.getElementById("vnc_dashboard_btn").onclick = function() {
    start_vnc();
    gui.Window.get().minimize();
  };

  /*initCheckbox("top-box", "top-titlebar", "top-titlebar.png", "Top Titlebar");
  initCheckbox("bottom-box", "bottom-titlebar", "bottom-titlebar.png", "Bottom Titlebar");
  initCheckbox("left-box", "left-titlebar", "left-titlebar.png", "Left Titlebar");
  initCheckbox("right-box", "right-titlebar", "right-titlebar.png", "Right Titlebar");

  document.getElementById("close-window-button").onclick = function() {
    window.close();
  };

  document.querySelector('#minimize-window-button').onclick = function () {
    gui.Window.get().minimize();
  };

  document.querySelector('#maximize-window-button').onclick = function () {
    gui.Window.get().maximize();
  };
  document.querySelector('#unmaximize-window-button').onclick = function () {
    gui.Window.get().unmaximize();
  };

  document.querySelector('#open-inspector-button').onclick = function () {
    var win = gui.Window.get();
    if (win.isDevToolsOpen()) {
      win.closeDevTools();
      this.innerText = "Open Developer Tools";
    } else {
      win.showDevTools();
      this.innerText = "Close Developer Tools";
    }
  };*/

  updateContentStyle();
  gui.Window.get().show();
  //gui.Window.get().maximize();
  //addTitlebar("top-titlebar", "top-titlebar.png", "United States Post Office");
};
