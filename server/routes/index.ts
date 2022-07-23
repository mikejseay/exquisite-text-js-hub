import { express } from "./../app";
import {
  NextFunction,
  Response,
  Request,
} from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.render('index', { title: 'Express' });
  // res.json({ title: 'Express' });
});

module.exports = router;
