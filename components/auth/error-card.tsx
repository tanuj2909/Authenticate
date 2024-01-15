import { CardWrapper } from "./card-wrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export const ErrorCard = () => {
    return <CardWrapper
        headerLabel="Oops! Somthing went wrong!"
        backButtonHref="/auth/login"
        backButtonLabel="Back to login"
    >
        <div className="w-full h-[50px] flex items-center justify-center bg-destructive/15 ">
            <ExclamationTriangleIcon className="text-destructive"/>
        </div>
    </CardWrapper>
}