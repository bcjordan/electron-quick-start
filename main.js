'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const five = require('johnny-five');

const serial = require('serial-worker');

serial.list((e, ports)=> {
  console.log("Port list:");
  console.log(ports);

  var boardPorts = ports.filter((p) => p.comName.match('usbmodem'));

  console.log("Identified USB serial ports:");
  console.log(boardPorts);

  var port = new serial.SerialPort(boardPorts[0].comName, { baudrate: 57600}, true, function (e) {
    console.log("Serial port initialized.");
    console.log(e);

    const board = new five.Board({
      port: port,
      repl: false
    });

    board.on('ready', () => {
      console.log("Board ready.");
      var led = new five.Led(13);
      led.blink();
    });
  });

  port.on('data', (data)=> {
    console.log(data);
  });

  port.open(()=> {
    port.write(new Buffer('Hello!', 'utf8'), ()=> {
      console.log('Written!');
    });
  });
});


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
