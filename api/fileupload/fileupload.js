const fs = require('fs')
const path = require('path')

var uploadFile = {
    upload: function(req, res,next) {

        //import the formiable module
        var formidable = require('formidable');

        //create incoming form object for processing
        var form = new formidable.IncomingForm();

        //create the dirctory if it doesn't exist
        let requireddirctory = 'upload'

        //call the parse method of IncomingForm to trigger the event emitter once the file is uploaded

        form.parse(req, function(err, fields, files) {
            //extract the required data from the uploaded file and it's parameters
            //`dataFile` is the input field name in html form
            //files is the object all the data in json format under a fields whose name would be same as input filed name . here the field name is `dataFile` . you can see json data by doing -- console.log(files)
            //navigate to root path

            let dirpath = path.resolve(__dirname),
                indexpath = dirpath.lastIndexOf('\\') + 1,
                rootpath = dirpath.substr(0, indexpath);

            let initialPath = files.dataFile.path,
                file_ext = files.dataFile.name.split('.').pop(),
                //get the last index of the `/` to fetch the file name
                index = initialPath.lastIndexOf('/') + 1,
                file_name = initialPath.substr(index),
                //create a destination path where you want to place the downloaded file
                final_path = path.join(path.join(rootpath, requireddirctory), 'uploadedfile' + '.' + file_ext);
            //check that if path exist or not if not create the folder
            fs.exists(path.join(path.join(rootpath, requireddirctory)), exist => {
                    if (!exist) {
                        fs.mkdirSync(path.join(path.join(rootpath, requireddirctory)),
                            err => {
                                if (err) {
                                    console.log(err)
                                }
                                console.log('Folder is created successfully')
                            })
                    }
                })
                // for backup of the existing
            fs.rename(path.join(path.join(rootpath, requireddirctory), 'uploadedfile' + '.' + file_ext), path.join(path.join(rootpath, requireddirctory), 'uploadedfile_' + Math.floor(Math.random().toString() * 1000) + '.' + file_ext), function(err) {
                if (err) {
                    console.log(err)
                }
            })
            fs.readFile(initialPath, function(err, data) {
                if (err) {
                    console.log(err)
                }
                fs.writeFile(final_path, data, function(err) {
                    if (err) {
                        console.log(err)
                    }
                    fs.unlink(initialPath,
                        function(err) {
                            if (err) {
                                res.status(500);
                                // res.json({ 'success': false });
                                console.log('fail')
                                res.render('index', {
                                    title: 'File Upload',
                                    message: 'Unable to upload file'
                                });
                            } else {
                                res.status(200);
                                console.log('success')
                                next();
                                // res.json({ 'success': true });
                            }
                        });
                });
            });
        });
    }
}
module.exports = uploadFile