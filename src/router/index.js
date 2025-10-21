import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Timeline from "../views/Timeline.vue";
import Membros from "../views/Membros.vue";
import Admin from "../views/Admin.vue";
import Fontes from "../views/Fontes.vue";
import Acervo from "../views/Acervo.vue";
import Fonte from "../views/componentes/Fonte.vue";
import Gabinete from "../views/componentes/Gabinete.vue";
import HdSsd from "../views/componentes/HdSsd.vue";
import Midia from "../views/componentes/Midia.vue";
import Perifericos from "../views/componentes/Perifericos.vue";
import PlacaMae from "../views/componentes/PlacaMae.vue";
import Processador from "../views/componentes/Processador.vue";
import Ram from "../views/componentes/Ram.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/timeline",
    name: "Timeline",
    component: Timeline,
  },
  {
    path: "/membros",
    name: "Membros",
    component: Membros,
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    beforeEnter: (to, from, next) => {
      if (import.meta.env.DEV) {
        next();
      } else {
        next("/");
      }
    },
  },
  {
    path: "/fontes",
    name: "Fontes",
    component: Fontes,
  },
  {
    path: "/acervo",
    name: "Acervo",
    component: Acervo,
  },
  {
    path: "/componentes/fonte",
    name: "Fonte",
    component: Fonte,
  },
  {
    path: "/componentes/gabinete",
    name: "Gabinete",
    component: Gabinete,
  },
  {
    path: "/componentes/hd-ssd",
    name: "HdSsd",
    component: HdSsd,
  },
  {
    path: "/componentes/midia",
    name: "Midia",
    component: Midia,
  },
  {
    path: "/componentes/perifericos",
    name: "Perifericos",
    component: Perifericos,
  },
  {
    path: "/componentes/placa-mae",
    name: "PlacaMae",
    component: PlacaMae,
  },
  {
    path: "/componentes/processador",
    name: "Processador",
    component: Processador,
  },
  {
    path: "/componentes/ram",
    name: "Ram",
    component: Ram,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
