import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";


export default function DeleteConfirmPage( { workspace }) {
    const {delete:destroy, processing} = useForm();

     useEffect(() => {
        document.body.classList.add("deletePage");

        return () => {
            document.body.classList.remove("deletePage");
        };
    }, []);

    const input = useRef(null);

    const [inputValue, setInputValue] = useState("");
    
    const isMatch = inputValue === workspace.name;

    const deleteWorkspace = (e) => {
        e.preventDefault();

        destroy(route('workspace.delete', workspace));
    }

    return (
        <body className="deletePage">
            <div>
                <Head title={`Delete-${workspace.name}`}/>
                
                <svg className="polygon-container" width="380px" height="500px" viewBox="0 0 837 1045" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                        <path d="M353,9 L626.664028,170 L626.664028,487 L353,642 L79.3359724,487 L79.3359724,170 L353,9 Z" id="Polygon-1" stroke="#007FB2" stroke-width="6" sketch:type="MSShapeGroup"></path>
                        <path d="M78.5,529 L147,569.186414 L147,648.311216 L78.5,687 L10,648.311216 L10,569.186414 L78.5,529 Z" id="Polygon-2" stroke="#EF4A5B" stroke-width="6" sketch:type="MSShapeGroup"></path>
                        <path d="M773,186 L827,217.538705 L827,279.636651 L773,310 L719,279.636651 L719,217.538705 L773,186 Z" id="Polygon-3" stroke="#795D9C" stroke-width="6" sketch:type="MSShapeGroup"></path>
                        <path d="M639,529 L773,607.846761 L773,763.091627 L639,839 L505,763.091627 L505,607.846761 L639,529 Z" id="Polygon-4" stroke="#F2773F" stroke-width="6" sketch:type="MSShapeGroup"></path>
                        <path d="M281,801 L383,861.025276 L383,979.21169 L281,1037 L179,979.21169 L179,861.025276 L281,801 Z" id="Polygon-5" stroke="#36B455" stroke-width="6" sketch:type="MSShapeGroup"></path>
                    </g>
                </svg>
                <div class="message-box">
                <h1 className="text-red-600">DELETE!</h1>
                <p className="opacity-50">{workspace.name}</p>
                <p className="text-lg">
                    Menghapus Workspace ini akan menghapus semua file, tugas, dan riwayat yang terkait.
                    Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
                    Untuk melanjutkan, silakan ketik nama Workspace yang akan dihapus.
                </p>
                <input 
                    type="text" 
                    name="workspace-name" 
                    onChange={(e) => setInputValue(e.target.value)}
                    className="mt-4 text-lg w-full border-0 border-b bg-transparent focus:outline-hidden opacity-50" 
                    ref={input}
                />
                <div class="buttons-con">
                    <div class="action-link-wrap">
                        <Link href={route('dashboard')} class="link-button link-back-button">Go Back</Link>
                        {isMatch ? (
                            <Link onClick={deleteWorkspace} class="link-button">
                                {processing ? "Menghapus..." : "Hapus"}
                            </Link>
                        ) : (
                            <Link href="" class="link-button !bg-gray-400 !cursor-not-allowed" disabled>Hapus</Link>
                        )}
                    </div>
                </div>
                </div>
            </div>

        </body>
    )

}