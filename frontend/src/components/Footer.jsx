const Footer = () => {
  return (
    <footer className="py-6 md:px-8 md:py-0 bg-black text-white border-t border-gray-800 transition duration-300 hover:bg-gray-800">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
            <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built by{" "}
                <a href="https://github.com/nagalil-hanoj-hteal3"
                target="_blank" className="font-medium underline underline-offset-4 hover:text-red-300">
                    EJ Lilagan
                </a>. The source code is available on{" "}
                <a href="https://github.com/nagalil-hanoj-hteal3/Netflix-Clone"
                target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4 hover:text-red-300">
                    GitHub
                </a>.{" "}
                If you are interested to know EJ, click {" "}
                <a href="https://nagalil-hanoj-hteal3.github.io/"
                target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4 hover:text-red-300">
                    here
                </a>!
            </p>

        </div>
    </footer>
  )
}

export default Footer;