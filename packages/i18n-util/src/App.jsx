import {useState, useCallback} from 'react'
import {getTranslate_api} from './apis/bd'
import {Input, Radio, Space, message, Spin} from 'antd';
import {sleep} from './utils/tools.js'
import './App.css'

const {TextArea} = Input;

function App() {
    const [content, setContent] = useState()
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [translateValue, setTranslateValue] = useState()
    const [lang, setLang] = useState('en');
    const onChange = (e) => {
        setLang(e.target.value);
    };

    const translate = useCallback(async (obj) => {
        let new_content = {}
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                // 避免频繁调用
                await sleep(parseInt(Math.random() * 1000 + 1000))
                new_content[key] = await getTranslate_api({query: obj[key], to: lang}).then(res => {
                    return res.trans_result[0].dst
                })

                setProgress(v => v + 1)
            } else {
                new_content[key] = await translate(obj[key])
            }
        }
        return new_content
    }, [lang])

    const getTranslate = async () => {
        if (!content) return
        let zh_content
        let newContent
        try {
            zh_content = JSON.parse(content)
        } catch (e) {
            console.log("-> 转义失败", e);
            setTranslateValue({})
            message.error('非法格式的输入，请输入标准的JSON格式')
            return
        }

        try {
            setLoading(true)
            // 清空上次
            setTranslateValue()
            newContent = await translate(zh_content)
        } catch (e) {
            message.error('翻译接口挂了')
        } finally {
            setLoading(false)
            setProgress(0)
        }

        setTranslateValue({...newContent})

    }


    return (
        <div className="App">
            <TextArea name="" id="" rows="20" placeholder="输入要翻译的文案,目前仅支持 json 形式,例如 { hello:'你好'}" onChange={e => setContent(e.target.value)}>
            </TextArea>
            <Radio.Group onChange={onChange} value={lang}>
                <Space>
                    <Radio value='en'>{"中 => 英"}</Radio>
                    <Radio value="th">{"中 => 泰语"}</Radio>
                    <Radio value="vie">{"中 => 越南"}</Radio>
                </Space>
            </Radio.Group>
            <Spin spinning={!!loading} tip={`已经翻译:${progress}个词`}>
                <button onClick={getTranslate} style={{margin: '10px'}}>一键翻译</button>

                <TextArea name="" id="" rows="20" placeholder="翻译结果"
                          value={JSON.stringify(translateValue, null, 2)}>
                </TextArea>
            </Spin>
        </div>
    )
}

export default App
