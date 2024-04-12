import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LCDClient, Coins, Numeric, MnemonicKey, Db, queryStringPrepare, prepareSQL } from '@glitterprotocol/glitter-sdk';
import { IBookItem, formatDate } from '../SearchResult';
import Avatar from '../../component/Avatar';
import './index.css';


function Detail() {
    const { id } = useParams();
    const [detail, setDetailInfo] = useState<IBookItem>();
    const [dbClient, setDbClient] = useState<Db | null>(null);
    const XIAN_HOST = "https://gateway.magnode.ru";
    const CHAIN_ID = "xian";
    const mnemonicKey = 'lesson police usual earth embrace someone opera season urban produce jealous canyon shrug usage subject cigar imitate hollow route inhale vocal special sun fuel';
    const libraryTable = 'index3.mirrorentry';
    const libraryColumns = 'title,category,body,_id,author,cover_url,article_link,language,published_time,category,display_name,avatar_url,author_url';


    const searchNews = async () => {
        if (dbClient) {
            const queries: any = [];
            const sqlString = queryStringPrepare(queries);

            const sql = assembleSql();
            const newSql = prepareSQL(sql, sqlString);
            const sqlData = await dbClient.query(newSql);
            const res = processDataModal(sqlData?.result || [])
            if (res && res.length > 0) {
                setDetailInfo(res[0]);
            }
            console.log(res[0]);
        }
    };

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
            setDbClient(dbClient,);
        } else {
            searchNews()
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



    const assembleSql = () => {
        return `select  ${libraryColumns} from ${libraryTable} where _id='${id}'`;
    }



    return (
        <div className="search-detail">
            <div className="detail-container">
                <div className="detail-group">
                    <div>
                        <h1
                            className="detail-text"
                            dangerouslySetInnerHTML={{
                                __html:
                                    detail?.title || '',
                            }}
                        ></h1>
                        <p className='detail-content' dangerouslySetInnerHTML={{
                            __html:
                                detail?.body || '',
                        }}></p>
                    </div>
                    <div className='detail-footer'>
                        <a href={detail?.article_link} target='black'>{detail?.article_link}</a>
                        <div className='item-footer '>
                            <p className='author-info'>
                                {detail?.avatar_url ? <img style={{ borderRadius: '50%', marginRight: '12px' }} src={detail.avatar_url} width={40} height={40} alt="" /> : <Avatar />}
                                <span>Author: {detail?.display_name}</span>
                            </p>
                            <p className='time-footer'>
                                <span>{formatDate(detail?.published_time || 0)}</span>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Detail;
