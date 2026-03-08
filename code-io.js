(function attachCodeIoController() {
  function createCodeIoController(deps) {
    const {
      state,
      ui,
      loadCodeIntoGame,
      setStartManualLoadVisible,
      setFriendManualLoadVisible,
      setCodeStatus,
    } = deps;

    async function readClipboardTextSafe() {
      if (!navigator.clipboard?.readText) {
        throw new Error("Clipboard access unavailable");
      }
      const text = await navigator.clipboard.readText();
      return String(text || "").trim();
    }

    async function tryLoadFromClipboardOrManual(target) {
      const isStart = target === "start";
      const inputEl = isStart ? ui.startImportCode : ui.friendImportCode;
      const fallbackOpen = isStart ? state.manualLoadFallback.start : state.manualLoadFallback.friend;
      const manualRaw = String(inputEl?.value || "").trim();

      if (fallbackOpen && manualRaw) {
        loadCodeIntoGame(manualRaw, target);
        return;
      }

      try {
        const clipboardText = await readClipboardTextSafe();
        if (!clipboardText) {
          throw new Error("Clipboard is empty");
        }
        const loaded = loadCodeIntoGame(clipboardText, target);
        if (loaded) return;
        if (isStart) {
          setStartManualLoadVisible(true);
        } else {
          setFriendManualLoadVisible(true);
        }
        setCodeStatus("Clipboard content did not load. Paste a turn link or code below.", true, target);
      } catch (err) {
        if (isStart) {
          setStartManualLoadVisible(true);
        } else {
          setFriendManualLoadVisible(true);
        }
        const fallbackMessage =
          err && err.message === "Clipboard is empty"
            ? "No clipboard link found. Paste a turn link or code below."
            : "Clipboard unavailable. Paste a turn link or code below.";
        setCodeStatus(fallbackMessage, true, target);
      }
    }

    function onStartLoadFromMenu() {
      tryLoadFromClipboardOrManual("start");
    }

    return {
      readClipboardTextSafe,
      tryLoadFromClipboardOrManual,
      onStartLoadFromMenu,
    };
  }

  window.createCodeIoController = createCodeIoController;
})();
