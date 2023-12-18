import { Tab, Tabs, TabsHeader } from '@material-tailwind/react';
import { Spinner } from '@material-tailwind/react';
import { useState } from 'react';
import { useEffect } from 'react';
import { FaCopy } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import lenguse from './lenguse.json';

const HadisSection = () => {
    const { key, name } = useParams()
    const [section, Setsection] = useState();
    useEffect(() => {
        fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${name}/sections/${key}.json`)
            .then(res => res.json())
            .then(ok => Setsection(ok));
    }, [])
    const [isCopied, setIsCopied] = useState(false);
    const copyToClipboard = (textToCopy) => {

        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000)

            })

            .catch(err => console.error('Unable to copy to clipboard', err));
    };
    const [activeTab, setActiveTab] = useState("Arabic");
    const [sortlg, setSortlg] = useState("Arabic");
    const lengusef = (full, sort) => {
        setActiveTab(full);
        setSortlg(sort);
    }
    const splits = (name) => {
        const [fast, sec] = name.split("-");
        return sec;
    }

    const [selectLg, setSelectLg] = useState('ara-');
    useEffect(() => {
        fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${sortlg}${splits(name)}/sections/${key}.json`)
            .then(res => res.json())
            .then(ok => Setsection(ok));
    }, [sortlg])

    return (
        <div className='min-h-screen text-white '>
            {
                section ?
                    <div className='p-3 flex flex-col items-center'>
                        <div className='text-center '>
                            <h1 className='text-4xl'>{section.metadata.name}</h1>
                            <h1>{section.metadata.section[key]}</h1>
                            <h1>{section.metadata.section_detail[key].hadithnumber_first}-{section.metadata.section_detail[key].hadithnumber_last}</h1>

                        </div>
                        <div className='flex items-center gap-3 pb-4'>

                            <Tabs value={activeTab}>
                                <TabsHeader
                                    className="rounded-none bg-transparent p-0"
                                    indicatorProps={{
                                        className:
                                            "bg-transparent border-b-2 border-[#1d4ed8] shadow-none rounded-none",
                                    }}
                                >


                                    {lenguse && lenguse.map((e) => (
                                        <Tab
                                            key={e.language}
                                            value={e.language}
                                            onClick={() => lengusef(e.language, e.name)}
                                            className={activeTab === e.language ? "text-white" : "text-gray-500"}
                                        >
                                            {e.language}
                                        </Tab>
                                    ))
                                    }

                                </TabsHeader>

                            </Tabs>
                        </div>
                        <div className='gap-2 flex flex-col'>
                            {
                                section.hadiths.map(e => (
                                    <div key={e.hadithnumber} className='bg-[#27272a] rounded-md py-5 md:px-2  min-h-[10rem]  md:flex justify-between cursor-pointer '>
                                        <div className='flex items-center md:flex-col w-16 xs:bg-red-900 pb-6 gap-5'>
                                            <div className='flex justify-center items-center w-11 h-11 p-1 rounded-full border-2'>

                                                <h1>{e.hadithnumber}</h1>
                                            </div>
                                            <h1 className='hover:text-[#1d4ed8] text-2xl duration-300' onClick={() => copyToClipboard(e.text)}><FaCopy /></h1>
                                            {/* <MusicPlayer songs={audio} /> */}
                                        </div>
                                        <div className='p-3 md:w-11/12'>
                                            <h1 className={`${sortlg == "ara-" ? "text-end" : "text-start"} text-4xl  duration-300`}>{e.text}</h1>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    :

                    <div className='text-9xl flex justify-center items-center h-screen'>
                        <Spinner className="h-36 w-36" color="blue" />
                    </div>
            }
        </div>
    );
};

export default HadisSection;