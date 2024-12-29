declare module "react-csv" {
  import { Component } from "react"

  export interface CSVLinkProps {
    data: any
    headers?: { label: string; key: string }[]
    filename?: string
    target?: string
    className?: string
    style?: React.CSSProperties
    onClick?: (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => void | boolean
    asyncOnClick?: boolean
  }

  export class CSVLink extends Component<CSVLinkProps, any> {}

  export interface CSVDownloadProps {
    data: any
    headers?: { label: string; key: string }[]
    filename?: string
    target?: string
  }

  export class CSVDownload extends Component<CSVDownloadProps, any> {}
}
