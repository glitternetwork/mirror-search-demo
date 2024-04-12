import { useEffect, useState } from 'react';
import { LCDClient, Coins, Numeric, MnemonicKey, Db, queryStringPrepare, MatchPhraseQuery, prepareSQL } from '@glitterprotocol/glitter-sdk';
import { useParams, useNavigate } from "react-router-dom"
import "./index.css"
import Avatar from '../../component/Avatar';


export interface IBookItem {
    body: string;
    display_name: string;
    published_time: number;
    avatar_url: string;
    _id: string;
    article_link: string;
    _highlight_title: string;
    title: string;
}

export function formatDate(timestamp: number) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dateObj = new Date(timestamp * 1000);
    const monthIndex = dateObj.getMonth();
    const month = months[monthIndex];
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();

    const formattedDate = `${month} ${day}, ${year}`;
    return formattedDate;
}


export default function SearchResult() {
    const { q } = useParams();
    const [query] = useState(q || '');
    const navigate = useNavigate();
    const [newsList, setNewsList] = useState<IBookItem[]>([]);
    const [dbClient, setDbClient] = useState<Db | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const XIAN_HOST = "https://gateway.magnode.ru";
    const CHAIN_ID = "xian";
    const mnemonicKey = 'lesson police usual earth embrace someone opera season urban produce jealous canyon shrug usage subject cigar imitate hollow route inhale vocal special sun fuel';
    const libraryTable = 'index3.mirrorentry';
    const libraryColumns = 'title,category,body,_id,author,cover_url,article_link,language,published_time,category,display_name,avatar_url,author_url';

    useEffect(() => {
        if (!dbClient) {
            const client = new LCDClient({
                URL: XIAN_HOST,
                chainID: CHAIN_ID,
                gasPrices: Coins.fromString('0.15agli'),
                gasAdjustment: Numeric.parse(1.5),
            });

            const key = new MnemonicKey({
                mnemonic: mnemonicKey,
                account: 0,
                index: 0,
            });

            const dbClient = client.db(key);
            setDbClient(dbClient);
        } else {
            searchBooks();
        }
    }, [dbClient]);

    const processDataModal = (resultArr: { row: any }[]): IBookItem[] => {
        return resultArr.map((item) => {
            const obj: Record<any, any> = {};
            Object.keys(item.row).forEach((key) => {
                obj[key] = item.row[key].value;
            });
            return obj as IBookItem;
        });
    }

    const highlight = (fields: string[]) => {
        const fieldsStr = fields.map((field) => `"${field}"`).join(',');
        return `/*+ SET_VAR(full_text_option='{"highlight":{ "style":"html","fields":[${fieldsStr}]}}') */`;
    }

    const assembleSql = () => {
        const highlightStr = highlight(['title', 'author'])
        return `select ${highlightStr}  ${libraryColumns} from ${libraryTable} where query_string(?) limit 0, 200`;
    }


    const searchBooks = async () => {
        if (dbClient && query) {
            setIsLoading(true);
            setNewsList([]);
            const queries = [];
            if (query) {
                queries.push(new MatchPhraseQuery('title', `${query}`));
            }
            const sqlString = queryStringPrepare(queries);

            const sql = assembleSql();
            const newSql = prepareSQL(sql, sqlString);
            const sqlData = await dbClient.query(newSql);
            const bookList = processDataModal(sqlData?.result || [])
            setNewsList(bookList);
            console.log(bookList);
            setIsLoading(false);
        }
    };




    return (
        <div className="list-container">
            <h1 onClick={() => navigate("/")}>Home</h1>
            <div className="list-group">
                {!isLoading ? newsList.length > 0 ? newsList.map((item, index) => (
                    <div onClick={() => {
                        window.open(`#/detail/${item._id}`, '_blank');
                    }} className="list-group-item" key={index}>
                        <div>
                            <h5
                                className="title-text"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        item._highlight_title,
                                }}
                            ></h5>
                            <p className='list-content' dangerouslySetInnerHTML={{
                                __html:
                                    item.body,
                            }}></p>
                            <div className='item-footer'>
                                <p className='author-info'>
                                    {item.avatar_url ? <img style={{ borderRadius: '50%' }} src={item.avatar_url} width={40} height={40} alt="" /> : <Avatar />}
                                    <span>Author: {item.display_name}</span>

                                </p>
                                <p className='time-footer'>
                                    <span>{formatDate(item.published_time)}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )) : <div className='empty-box'> Empty</div> : <div className='loading-box'>Loading...</div>}
            </div>
        </div >
    )
}
