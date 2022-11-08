import * as express from 'express';
import * as cors from 'cors';
import {extname, resolve, basename} from 'path';
import * as multer from 'multer';
import {getApplicationMetadata} from "../../src";

const app = express();
const port = 3500;

app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './uploads');
    },
    async filename(req, file, cb) {
        const [filename, extension] = [basename(file.originalname), extname(file.originalname)];
        const newFileName = `${filename}-${Date.now()}${extension}`;
        req.body[file.fieldname] = newFileName;

        cb(null, newFileName);
    },
});

const upload = multer({ storage });

app.post('/', upload.any(), async (req, res) => {

    const results = await Promise.all(Object.entries(req.body).map(async (data: [string, string]) => {
        const [field, filename] = data;
        const filePath = resolve(process.cwd(), 'uploads', filename);

        try {
            return [field, await getApplicationMetadata(filePath, filename.endsWith('ipa') ? 'ios' : 'android')];
        } catch (e) {
            console.log(e);
            return [];
        }
    }));

    res.send(Object.fromEntries(results));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});