const { ipcMain, BrowserWindow, BrowserView, dialog } = require("electron");
const { exec, execSync } = require("child_process");
const path = require("path");
const waitOn = require("wait-on");
const os = require("os");
const { readFileSync, writeFileSync, appendFileSync } = require("fs");

const { createErrorDialog } = require("./dialog");
const { handleErrorMessage, portNumber } = require("./utils");

const userHomeDirectory = os.homedir();

const registerIpcHandlers = () => {
  ipcMain.handle("get-path", async () => {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openDirectory"],
      });

      if (canceled) return new Error("open dialog failed");

      const filePath = filePaths[0];
      exec(
        `ln -s ${userHomeDirectory}/Desktop/reactree-frontend/src/utils/reactree.js ${filePath}/src/reactree-symlink.js`,
        (error, stdout, stderr) => {
          const pathError = handleErrorMessage(stderr);

          if (pathError) {
            view.webContents.loadFile(
              path.join(__dirname, "../views/errorPage.html"),
            );
            createErrorDialog(pathError);
          }
        },
      );

      const originalUserIndexJScodes = readFileSync(
        `${filePath}/src/index.js`,
        {
          encoding: "utf8",
        },
      );

      const JScodes = `
        // eslint-disable-next-line import/first
        import reactree from "./reactree-symlink";

        setTimeout(() => {
          reactree(root._internalRoot);
        }, 0);
      `;

      appendFileSync(`${filePath}/src/index.js`, JScodes);

      const mainWindow = BrowserWindow.getFocusedWindow();
      mainWindow.webContents.send("send-file-path", filePath);

      const view = new BrowserView();
      mainWindow.setBrowserView(view);
      view.setBounds({
        x: 8,
        y: 164,
        width: 740,
        height: 740,
      });
      view.setAutoResize({ width: true, height: true });
      view.setBackgroundColor("white");
      view.webContents.loadFile(path.join(__dirname, "../views/loading.html"));

      execSync(
        `lsof -i :${portNumber} | grep LISTEN | awk '{print $2}' | xargs kill`,
      );

      exec(
        `PORT=${portNumber} BROWSER=none npm start`,
        { cwd: filePath },
        (error, stdout, stderr) => {
          const startError = handleErrorMessage(stderr);
          
          if (startError) {
            view.webContents.loadFile(
              path.join(__dirname, "../views/errorPage.html"),
            );
            createErrorDialog(startError);
          }
        },
      );
 
      await waitOn({ resources: [`http://localhost:${portNumber}`] });
      view.webContents.loadURL(`http://localhost:${portNumber}`);

      await waitOn({ resources: [`${userHomeDirectory}/Downloads/data.json`] });

      writeFileSync(`${filePath}/src/index.js`, originalUserIndexJScodes, {
        encoding: "utf8",
      });

      exec(`rm ${filePath}/src/reactree-symlink.js`);

      const fiberFile = readFileSync(
        path.join(`${userHomeDirectory}/Downloads/data.json`),
      );
      exec("rm data.json", { cwd: `${os.homedir()}/Downloads` });

      mainWindow.webContents.send("get-node-data", JSON.parse(fiberFile));

      return filePath;
    } catch (error) {
      view.webContents.loadFile(
        path.join(__dirname, "../views/errorPage.html"),
      );
      createErrorDialog(
        "서버 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요.",
      );
    }
  });
};

module.exports = { registerIpcHandlers };
