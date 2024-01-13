"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export const Social = () => {
    return <div className="flex justify-center items-center w-full gap-x-4">
        <Button
            size={"lg"}
            variant={"outline"}
            onClick={() => {}}
        >
            <FcGoogle className="h-5 w-5"/>
        </Button>
        <Button
            size={"lg"}
            variant={"outline"}
            onClick={() => {}}
        >
            <FaGithub className="h-5 w-5"/>
        </Button>
    </div>
}