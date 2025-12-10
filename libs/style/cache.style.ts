export const cacheViewerEmailTeamplateStyles = {
    body: `
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f5f7fa;
        color: #333;
    `,

    header: `
        background-color: #004534;
        color: white;
        padding: 15px 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `,

    cache_container: `
        display: flex;
        height: calc(100vh - 58px);
    `,

    key_list_panel: `
        width: 300px;
        background-color: #fff;
        border-right: 1px solid #ddd;
        overflow-y: auto;
        flex-shrink: 0;
        padding: 10px 0;
    `,

    filter_bar: `
        padding: 0 10px 10px 10px;
    `,

    filter_input: `
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    `,

    cache_key: `
        padding: 10px;
        cursor: pointer;
        font-family: 'Consolas', 'Courier New', monospace;
        font-size: 0.9em;
        border-left: 3px solid transparent;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: background-color 0.15s;
        width: 100%;
        box-sizing: border-box;
    `,

    cache_key_active: `
        background-color: #e0f2ff;
        border-left-color: #00C896;
        font-weight: 600;
    `,

    detail_view_panel: `
        flex-grow: 1;
        padding: 20px;
        overflow-y: auto;
        background-color: #fefefe;
    `,

    detail_heading: `
        color: #00C896;
        margin-top: 0;
        border-bottom: 2px solid #e0e0e0;
        padding-bottom: 10px;
        margin-bottom: 20px;
    `,

    detail_pre: `
        background-color: #282c34;
        color: #abb2bf;
        padding: 15px;
        border-radius: 6px;
        overflow-x: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
        font-family: 'Fira Code', Consolas, monospace;
        line-height: 1.4;
        min-height: 200px;
        display: none;
    `
};
