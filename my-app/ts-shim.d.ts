declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'bootstrap' {
  import bootstrap from 'bootstrap'
  const Alert = class { constructor(a: any) { } }
  const Button = class { constructor(a: any) { } }
  const Carousel = class { constructor(a: any) { } }
  const Dropdown = class { constructor(a: any) { } }
  const Modal = class { constructor(a: any) { } }
  const Offcanvas = class { constructor(a: any) { } }
  const Popover = class { constructor(a: any) { } }
  const ScrollSpy = class { constructor(a: any) { } }
  const Tab = class { constructor(a: any) { } }
  const Toast = class { constructor(a: any) { } }
  const Tooltip = class { constructor(a: any) { } }
  export default bootstrap 
  export { Alert, Button, Carousel, Dropdown, Modal, Offcanvas, Popover, ScrollSpy, Tab, Toast, Tooltip }
}