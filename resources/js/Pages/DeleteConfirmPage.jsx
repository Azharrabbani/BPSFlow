import { Head, Link, usePage } from "@inertiajs/react";


export default function DeleteConfirmPage( { workspace }) {
    console.log(workspace);
    
    return (
        <div>
            <Head title={`Delete-${workspace.name}`}/>
            <h1>{workspace.name}</h1>
        </div>
    )
}