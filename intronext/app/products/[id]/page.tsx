"use client";
import { useParams } from "next/navigation";

export default function Products() {
    const params = useParams();

    return (
        <div>
            <h1>Products Page</h1>
            <span><h3 className="text-2xl text-red-600">{params.id}</h3></span>
        </div>
    );
}
