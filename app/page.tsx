import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";



export default function Home() {
  return <main className="flex flex-col justify-center items-center h-full bg-yellow-500">
    <div className="space-y-6 text-center">
      <h1 className={"text-6xl font-semibold text-gray-800 drop-shadow-md"}>
        Authenticate
      </h1>
      <p className="text-gray-800 text-lg font-semibold">
        Autentication service
      </p>
      <div>
        <LoginButton>
          <Button size={"lg"}>
            Sign in
          </Button>
        </LoginButton>
        
      </div>
    </div>
    
  </main>

}