import { isProfile } from "../../tools/path-detector";
import { checkIfElementsReady } from "../../tools/wait-until-ready";
import createElement from "../../tools/create-element";
import settings from "../../tools/settings";
import submitForm from "../../tools/submit-form";
import Fixer from "../fixer";

export default class StatusFixer extends Fixer {
    isApplieble(location) {
        return settings.defreshProfilePage.value && settings.defreshProfilePageUserStatus.value && isProfile(location);
    }

    waitUntilFixerReady() {
        return checkIfElementsReady("main:nth-child(1) .user-status-container");
    }

    apply() {
        let statusContainer = document.querySelector("main .user-status-container");
        let emoji = statusContainer.querySelector("img") || statusContainer.querySelector("g-emoji");
        let textContainer = statusContainer.querySelector(".user-status-message-wrapper");
        let text = textContainer ? textContainer.innerText.trim() : "";
        let isBusy = !!statusContainer.querySelector(".bg-yellow-light");
        let details = statusContainer.querySelector("details-dialog");

        this._fixDetails(details);
        let defreshedStatus = this._createStatusContainer(emoji, text, isBusy, details);



        statusContainer.replaceWith(defreshedStatus);

        let avatar = document.querySelector("main img.avatar");
        if (avatar)
            avatar.classList.add("avatar-before-user-status");
    }

    _createStatusContainer(emoji, text, isBusy = false, details = null) {
        return createElement(details ? "details" : "div", {
            className: "user-status-container border position-relative hide-sm hide-md" + (details ? " details-reset details-overlay details-overlay-dark" : ""),
            children: [
                createElement(details ? "summary" : "div", {
                    className: "d-flex",
                    children: [createElement("div", {
                        className: "d-flex p-2 width-full border-0 rounded-bottom-0" + (isBusy ? " user-status-container-border-busy bg-yellow-light border-yellow" : ""),
                        children: [
                            createElement("div", {
                                className: "flex-self-start mr-1 ml-1",
                                children: [createElement("div", {
                                    children: [emoji]
                                })]
                            }),
                            createElement("div", {
                                className: "user-status-message-wrapper f6 mt-1 text-gray-dark ws-normal",
                                children: [
                                    createElement("div", {
                                        children: [createElement("div", {
                                            innerText: text
                                        })]
                                    })
                                ]
                            })
                        ]
                    })]
                }),
                details
            ]
            .filter(x => x)
        });
    }

    _fixDetails(details) {
        if (!details)
            return;

        this._fixDetailsFragments(details);
        this._fixDetailsEmojis(details);
        this._fixDetailsButtons(details);
    }

    _fixDetailsFragments(details) {
        for (let fragment of [...details.querySelectorAll("include-fragment")])
            fragment.setAttribute("src", fragment.getAttribute("data-url"));
    }

    _fixDetailsEmojis(details) {
        let emojiContainer = details.querySelector(".js-user-status-custom-emoji");
        let emojiInput = details.querySelector("form").emoji;
        let openPicker = details.querySelector(".btn-open-emoji-picker");
        openPicker.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            let picker = details.querySelector("emoji-picker");
            if (picker) {
                this._fixEmojiPicker(emojiContainer, emojiInput, picker);
                picker.open();
            }
        });
    }

    _fixEmojiPicker(targetContainer, targetInput, picker) {
        if (picker.fixed)
            return;
        
        for (let btn of [...picker.querySelectorAll(".js-emoji-button")])
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                targetInput.value = this.getAttribute("value");
                let emoji = this.children[0].cloneNode(true);
                emoji.removeAttribute("width");
                emoji.removeAttribute("height");
                targetContainer.children[0].replaceWith(createElement("div", {
                    children: [emoji]
                }));
                picker.close();
            });

        picker.fixed = true;
    }

    _fixDetailsButtons(details) {
        let submitButton = details.querySelector("form button[type='submit']");
        let clearButton = submitButton.parentElement.querySelector("button:not([type='submit'])");

        submitButton.addEventListener("click", async function (e) {
            e.preventDefault();
            await submitForm(this.form);
            location.reload();
        });
        clearButton.addEventListener("click", async function(e) {
            e.preventDefault();

            let form = this.form;
            form.emoji.value = "";
            form.message.value = "";
            form.limited_availability.value = "0";

            await submitForm(this.form);
            location.reload();
        });
    }
}