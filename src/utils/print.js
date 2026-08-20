/*
 * Prints a standalone HTML document without navigating away from the app.
 *
 * The markup is rendered inside an offscreen iframe so the browser print
 * dialog only ever sees the document we build, and no popup window is
 * opened (which pop-up blockers routinely reject).
 */
export const printHtmlDocument = (html) => {
    const frame = document.createElement("iframe");

    frame.setAttribute("aria-hidden", "true");
    frame.setAttribute("tabindex", "-1");

    frame.style.position = "fixed";
    frame.style.right = "0";
    frame.style.bottom = "0";
    frame.style.width = "0";
    frame.style.height = "0";
    frame.style.border = "0";
    frame.style.visibility = "hidden";

    let removed = false;

    const remove = () => {
        if (removed) return;

        removed = true;

        if (frame.parentNode) {
            frame.parentNode.removeChild(frame);
        }
    };

    frame.onload = () => {
        const frameWindow = frame.contentWindow;

        if (!frameWindow) {
            remove();
            return;
        }

        /*
         * Chrome and Firefox fire afterprint once the dialog closes; the
         * timeout is the fallback for browsers that do not, and for the
         * case where printing is cancelled.
         */
        frameWindow.onafterprint = remove;

        frameWindow.focus();
        frameWindow.print();

        window.setTimeout(remove, 60000);
    };

    frame.srcdoc = html;

    document.body.appendChild(frame);
};
