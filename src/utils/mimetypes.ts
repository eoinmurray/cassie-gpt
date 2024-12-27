
export function getMimeType(file: string) {
  const filetypes = [ 
    { extension: '.c', mimetype: 'text/x-c' },
    { extension: '.cs', mimetype: 'text/x-csharp' },
    { extension: '.cpp', mimetype: 'text/x-c++' },
    { extension: '.doc', mimetype: 'application/msword' },
    { extension: '.docx', mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    { extension: '.html', mimetype: 'text/html' },
    { extension: '.java', mimetype: 'text/x-java' },
    { extension: '.json', mimetype: 'application/json' },
    { extension: '.md', mimetype: 'text/markdown' },
    { extension: '.pdf', mimetype: 'application/pdf' },
    { extension: '.php', mimetype: 'text/x-php' },
    { extension: '.pptx', mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
    { extension: '.py', mimetype: 'text/x-python' },
    { extension: '.py', mimetype: 'text/x-script.python' },
    { extension: '.rb', mimetype: 'text/x-ruby' },
    { extension: '.tex', mimetype: 'text/x-tex' },
    { extension: '.txt', mimetype: 'text/plain' },
    { extension: '.css', mimetype: 'text/css' },
    { extension: '.js', mimetype: 'text/javascript' },
    { extension: '.sh', mimetype: 'application/x-sh' },
    { extension: '.ts', mimetype: 'application/typescript' },
  ]
  const extension = `.${file.split('.').pop()}`;

  const filetype = filetypes.find(ft => {
    return ft.extension === extension 
  });

  if (!filetype) {
    throw new Error(`No filetype found for ${file}`);
  }

  return filetype?.mimetype;
}