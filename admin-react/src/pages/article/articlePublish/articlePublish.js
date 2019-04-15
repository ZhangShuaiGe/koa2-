import React, {Component} from 'react';
import MdEditor from 'react-markdown-editor-lite'
const mock_content = "Hello.\n\n * This is markdown.\n * It is fun\n * Love it or leave it."
export default class ArticlePublish extends Component{
    state = {
        markdown:"",
    }
    mdEditor = null
    handleGetMdValue = () => {
        this.mdEditor && alert(this.mdEditor.getMdValue())
    }
    handleGetHtmlValue = () => {
        this.mdEditor && alert(this.mdEditor.getHtmlValue())
    }


    handleEditorChange =  ({html, md}) => {
        console.log('handleEditorChange', html)
        console.log('md', md)
    }

    render() {
        return (
            <div>
                <button onClick={this.handleGetMdValue} >getMdValue</button>
                <button onClick={this.handleGetHtmlValue} >getHtmlValue</button>

                <MdEditor
                        ref={node => this.mdEditor = node}
                        value={mock_content}
                        onChange={this.handleEditorChange}
                />
            </div>
        )
    }
}