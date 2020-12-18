import Calculus from "./CalculusNote";
import LinearAlgMd from "./LinearAlg";
import MST from "./Mst";
import InitShell from "./InitSh";

const route = [
	{
		component: Calculus,
		tab: "微积分笔记",
		path: "/calculus.md",
	},
	{
		component: LinearAlgMd,
		tab: "线代笔记",
		path: "/linearAlg.md",
	},
	{
		component: MST,
		tab: "最小生成树",
		path: "/mst.md",
	},
	{
		component: InitShell,
		tab: "迅速部署阿里云服务器",
		path: "/InitShell.md",
	},
];

export default route;
