let files = JSON.parse('[".github/workflows/main.yml"]')
for (let i=0; i < files.length; i++) {
    console.log(i)
    console.log(files[i])
    let filename = files[i]
    let extension = filename.slice(filename.lastIndexOf('.'))
    console.log(`Extension: ${extension}`)
}

console.log(`Test 12345: files: ${files}`)