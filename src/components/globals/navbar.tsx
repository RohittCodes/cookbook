import { ModeToggle } from "./mode";

const Navbar = () => {
    return ( 
        <div className="sticky px-8 flex items-center justify-between py-4 bg-background border-b border-primary-background top-0 z-10">
            <h1 className="text-2xl font-bold text-primary-background">Recipe App</h1>
            <div className="flex items-center gap-4">
                <ModeToggle />
            </div>
        </div>
    );
}
 
export default Navbar;