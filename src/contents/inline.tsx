// set inital css for plasmo-csui#find-csui
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
    css: ["inline.css"]
}

const WrapperCss = () => {
  return (
    <div className="test-injectcss"></div>
  )
}

export default WrapperCss