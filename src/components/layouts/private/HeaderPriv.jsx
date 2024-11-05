import { NavPriv } from "./NavPriv";

export const HeaderPriv = () => {
  return (
    <header className="layout__navbar">
      <div className="navbar__header">
        <a href="#" className="navbar__title" >RED SOCIAL</a>
      </div>
      <NavPriv />
    </header>
  )
}
