import { SmallReactive } from "../vendor/small-reactive/core.js";
import { AppComponent } from "./components/app.component.js";

import { Request } from "./services/request.service.js";
import { FilesService } from "./services/files.service.js";

SmallReactive.start({
  target: "#app",
  component: AppComponent,
  inject: [
    Request,
    FilesService
  ]
});
