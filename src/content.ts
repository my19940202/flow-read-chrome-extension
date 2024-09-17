// 在content.ts里面实现一个简单专注阅读的demo效果
// 1. 悬浮高亮部分区域
// 2. 用来专注阅读：点击后触发逐渐动画形式的underline文章的文章
// 3. 用来宣传吸睛: youtube视频下面
import type { PlasmoCSConfig } from "plasmo"
export {} 
export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
    world: "MAIN"
}

// 函数用于添加/移除hover效果
function applyHoverEffect(element) {
    // 移除所有已添加的hover效果
    document.querySelectorAll('.hover-effect').forEach(el => {
        el.classList.remove('hover-effect');
    });
    // 为当前元素添加hover效果
    if (element) {
        element.classList.add('hover-effect');
    }
}

function debounce(func, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function filterNode(node: Node, filterFunc: (node: Node) => boolean, depth: number = 1): boolean {
    while (node && depth > 0) {
        if (filterFunc(node)) {
            return true
        }
        depth -= 1
        node = node.parentNode
    }
    return false
}

function filterByTag(node: Node): boolean {
    const ignore_tags = [
        "SVG", "STYLE", "SCRIPT", "IFRAME", "DIALOG", "INPUT", "BUTTON", "SLECT", "TEXTAREA"
    ]
    return ignore_tags.includes(node.nodeName)
}

function getTextNodeByWalker(dom): Node[] {
    let treeWalker = document.createTreeWalker(dom, NodeFilter.SHOW_TEXT, {
        acceptNode: (node: Node) => {
            if (filterNode(node, filterByTag)) {
                return NodeFilter.FILTER_REJECT
            }

            return NodeFilter.FILTER_ACCEPT
        }
    })

    const textNodes: Node[] = []
    let currentNode = treeWalker.nextNode()
    while (currentNode) {
        textNodes.push(currentNode)
        currentNode = treeWalker.nextNode()
    }

    return textNodes
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

function testFunction(e) {
    // 确保鼠标下方是div元素，并且不是document.body
    if (e && e !== document.body) {
        applyHoverEffect(e);
    } else {
        applyHoverEffect(null); // 清除hover效果
    }
}
const debouncedFunction = debounce(testFunction, 100);


// 监听鼠标移动事件
document.addEventListener('mouseover', (event) => {
    const x = event.clientX;
    const y = event.clientY;
    const element = document.elementFromPoint(x, y);

    debouncedFunction(element);
});

// 监听hover区域点击的
document.addEventListener('click', async (event) => {
    // collect text nodes under the cursor
    let selectNodes = getTextNodeByWalker(event.target);
    let formatNode = []
    for (let idx = 0; idx < selectNodes.length; idx++) {
        const element = selectNodes[idx];
        if (element && element.data && element.data.replace(/\s+/g, '')) {
            element.parentElement.style.color = 'transparent';
            formatNode.push(element)
        }
    }
    console.log(formatNode, 'formatNode length');
    for await (const item of formatNode) {
        textNode = item;
        // 采用下划线 引导阅读
        // await underlineByWord(item);

        // 采用打字效果 引导阅读
        await typingByWord(item);
        // debugger;
        // window.requestAnimationFrame(ts => step(ts, textNode.length));
        // await sleep(100)
        // 目前发现 css highlight性能很好 完全没有必要 使用requestAnimationFrame
    }

    
    // start underline effect
    // requestAnimationFrame(() => {
    //     console.log('this call  by requestAnimationFrame');
    // })
});

const highlight = new Highlight();
// 加深对回调函数的理解
async function underlineByWord(textNode) {
    const textList = textNode.data.split('');
    let idx = 1;
    for await (const item of textList) {
        // textNode = item;
        // console.log(item, 'item', item.length);
        // debugger;
        // window.requestAnimationFrame(ts => step(ts, textNode.length));
        // await sleep(100)
        // 目前发现 css highlight性能很好 完全没有必要 使用requestAnimationFrame
        const range = new Range();
        range.setStart(textNode, 0);
        range.setEnd(textNode, idx);
        highlight.add(range);
        CSS.highlights.set('demo-highlight', highlight);
        idx = idx + 1;

        await sleep(15);

    }
    // if (offset > 1) {
    //     offset = offset - 1;
    //     // console.log(textNode, offset, 'this call by requestAnimationFrame');
    //     // window.requestAnimationFrame(ts => step(ts, offset));
    //     setTimeout(() => {
    //         step('', offset)
    //     }, 100);
    // }

    // splitText.forEach(function(char, index) {
        
    // });
}


async function typingByWord(textNode) {
    const textList = textNode.data.split('');
    let idx = 1;
    for await (const item of textList) {
        // textNode = item;
        // console.log(item, 'item', item.length);
        // debugger;
        // window.requestAnimationFrame(ts => step(ts, textNode.length));
        // await sleep(100)
        // 目前发现 css highlight性能很好 完全没有必要 使用requestAnimationFrame
        const range = new Range();
        range.setStart(textNode, 0);
        range.setEnd(textNode, idx);
        highlight.add(range);
        CSS.highlights.set('black-highlight', highlight);
        idx = idx + 1;
        await sleep(10);

    }
}

let start = null;
let textNode = null;

// highlight animation
// 加深对回调函数的理解
function step(ts, offset) {
    if (offset > 1) {
        offset = offset - 1;
        const range = new Range();
        range.setStart(textNode, 0);
        range.setEnd(textNode, textNode.length - offset);
        const highlight = new Highlight(range);
        CSS.highlights.set('demo-highlight', highlight);
        // console.log(textNode, offset, 'this call by requestAnimationFrame');
        // window.requestAnimationFrame(ts => step(ts, offset));
        setTimeout(() => {
            step('', offset)
        }, 100);
    }
    else {
        // 执行完后 全局变量恢复 下一次可以执行
        start = null
    }
}

// 这边其实有两点
// 1. 一个textNode里面,文字按照offset一个一个的下划线显示
// 2. 存在多个textNode, 需要逐个执行，然后按照用户行为进行stop