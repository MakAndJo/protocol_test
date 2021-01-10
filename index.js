const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

var link = 'def'

// This will catch clicks on links such as <a href="foobar://abc=1">open in foobar</a>
app.on('open-url', function (event, data) {
  event.preventDefault();
  link = data;
})

// If we are running a non-packaged version of the app && on windows
if(process.env.NODE_ENV === 'development' && process.platform === 'win32') {
  // Set the path of electron.exe and your app.
  // These two additional parameters are only available on windows.
  app.setAsDefaultProtocolClient('test', process.execPath, [path.resolve(process.argv[1])]);        
} else {
  app.setAsDefaultProtocolClient('test');
}

if (process.platform == 'win32') {
  // Keep only command line / deep linked arguments
  link = path.resolve(process.argv.slice(1))
}

// Export so you can access it from the renderer thread
module.exports.getLink = () => link