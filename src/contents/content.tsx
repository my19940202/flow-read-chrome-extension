// content UI compoent entry
import React from "react"
import cssText from "data-text:./content.css"
import type { PlasmoCSConfig, PlasmoGetShadowHostId } from "plasmo"

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
    // content insertion point
    // https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts?hl=zh-cn#static-declarative
    run_at: "document_start"
}

const HOST_ID = "find-csui"
export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID

export const getStyle = () => {
    const style = document.createElement("style")
    style.textContent = cssText
    return style
}

const Content = () => (
    <div className="type-wrapper">
    </div>
)

export default Content
