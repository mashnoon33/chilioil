import { FiSun } from "react-icons/fi";
import { MdSearch } from "react-icons/md";

import Link from "next/link";
export function Shell({ children }: { children: React.ReactNode }) {
  return <div className="h-screen flex flex-col w-full overflow-auto ">
    <Header />
    {/* <SearchPallete /> */}
    <div className="dark:bg-main w-full  flex flex-1 h-[calc(100vh-67px)] ">
      {children}
    </div> 
  </div>;
}



export function Header() {
  return <header className="sticky  h-[65px] top-0 z-10 w-full backdrop-blur flex-none  lg:z-50 bg-blend-darken dark:bg-blend-lighten border-b border-neutral-100 dark:border-neutral-800   ">
    <div className="h-full px-4  flex items-center justify-between mx-auto  md:px-8  sm:px-2 lg:px-8  ">
      <div className="mt-1">
        <FiSun fontSize="24px" />
        {/* <ThemeSwitch /> */}
      </div>
      <Link href="/" className="text-2xl font-black text-brand ">
        cheflog
      </Link>
      {/* {router.pathname.endsWith('admin') ? (3
      <button
        className=" btn btn-xs btn-outline my-0 mr-2"
        onClick={() => console.log('Login')}
      >
        {false ? 'Logout' : 'Login'}
      </button>
    ) : (
      <button
        className=" btn btn-sm  btn-ghost  my-0 "
        // Onclick broadclast the showPallete event
        onClick={() => {
          window.dispatchEvent(
            new CustomEvent('showPallete', { bubbles: true }),
          );
        }}
      >
        <MdSearch fontSize="24px" />
      </button>
    )} */}
      <MdSearch fontSize="24px" />
    </div>
  </header>
}

