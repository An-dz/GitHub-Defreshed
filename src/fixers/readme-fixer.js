import { isRepoRoot, isRepoTree } from "../tools/path-detector";
import Fixer from "./fixer";

export default class ReadmeFixer extends Fixer {
    isApplieble(_, __, location) {
        return isRepoRoot(location) || isRepoTree(location);
    }

    apply(_document) {
        let readme = _document.querySelector("#readme");
        if (readme) {
            readme.className = "Box md js-code-block-container Box--condensed";
            readme.querySelector(".Box-header").className = "Box-header d-flex flex-items-center flex-justify-between";
    
            let titleContent = `<svg class="octicon octicon-book" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M0 1.75A.75.75 0 01.75 1h4.253c1.227 0 2.317.59 3 1.501A3.744 3.744 0 0111.006 1h4.245a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-4.507a2.25 2.25 0 00-1.591.659l-.622.621a.75.75 0 01-1.06 0l-.622-.621A2.25 2.25 0 005.258 13H.75a.75.75 0 01-.75-.75V1.75zm8.755 3a2.25 2.25 0 012.25-2.25H14.5v9h-3.757c-.71 0-1.4.201-1.992.572l.004-7.322zm-1.504 7.324l.004-5.073-.002-2.253A2.25 2.25 0 005.003 2.5H1.5v9h3.757a3.75 3.75 0 011.994.574z"></path></svg>`;
            let titleElement = readme.querySelector(".Box-title.pr-3");
            titleElement.innerHTML = titleContent + titleElement.innerHTML;
        }
    }
}