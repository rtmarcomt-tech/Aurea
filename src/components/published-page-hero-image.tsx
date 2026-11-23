import {getPublishedPageContent} from "@/lib/page-content";
import {ImageSequence} from "@/components/image-sequence";

const visualSets:Record<string,Array<{url:string;alt:string;title:string;body:string}>>={
 home:[
  {url:"/visuals/aurea-architecture.svg",alt:"Arquitetura abstrata em azul, violeta e ciano",title:"Estratégia com visão.",body:"Uma estrutura integrada para transformar ideias em experiências digitais."},
  {url:"/visuals/aurea-ribbons.svg",alt:"Formas translúcidas fluidas em movimento",title:"Criatividade em movimento.",body:"Identidade, imagem e comunicação articuladas com intenção."},
  {url:"/visuals/aurea-orbit.svg",alt:"Órbitas luminosas abstratas",title:"Tecnologia com propósito.",body:"Soluções digitais construídas em função de objetivos concretos."},
  {url:"/visuals/aurea-lightspace.svg",alt:"Espaço abstrato atravessado por luz azul e violeta",title:"Preparados para evoluir.",body:"Uma presença digital concebida para acompanhar o próximo passo."}
 ],
 b2b:[
  {url:"/visuals/aurea-lightspace.svg",alt:"Espaço arquitetónico abstrato com luz azul e violeta",title:"Uma presença com direção.",body:"Estratégia e identidade para comunicar com clareza e consistência."},
  {url:"/visuals/aurea-architecture.svg",alt:"Estruturas arquitetónicas abstratas",title:"Sistemas que trabalham em conjunto.",body:"Websites, plataformas e tecnologia alinhados com a operação."},
  {url:"/visuals/aurea-orbit.svg",alt:"Estruturas orbitais luminosas",title:"Crescimento com fundamento.",body:"Uma base digital preparada para novas oportunidades."}
 ],
 creators:[
  {url:"/visuals/aurea-ribbons.svg",alt:"Composição abstrata de fitas translúcidas",title:"Uma identidade própria.",body:"Uma presença digital reconhecível, coerente e independente."},
  {url:"/visuals/aurea-orbit.svg",alt:"Formas orbitais luminosas abstratas",title:"Mais controlo sobre o teu projeto.",body:"Conteúdos, canais e experiências organizados numa estrutura tua."},
  {url:"/visuals/aurea-architecture.svg",alt:"Arquitetura abstrata em tons frios",title:"Da imagem à estrutura.",body:"Tecnologia e estratégia para desenvolver o teu negócio digital."}
 ]
};

export async function PublishedPageHeroImage({pageKey}:{pageKey:string}){
 const data=await getPublishedPageContent(pageKey);
 const frames=Array.isArray(data?.heroImages)?data.heroImages.flatMap((item)=>{if(!item||typeof item!=="object")return[];const frame=item as {url?:unknown;alt?:unknown;title?:unknown;body?:unknown};return typeof frame.url==="string"&&frame.url?[{url:frame.url,alt:typeof frame.alt==="string"?frame.alt:"",title:typeof frame.title==="string"?frame.title:"",body:typeof frame.body==="string"?frame.body:""}]:[]}):[];
 const legacy=typeof data?.heroImage==="string"&&data.heroImage?[{url:data.heroImage,alt:typeof data.heroImageAlt==="string"?data.heroImageAlt:""}]:[];
 const sequence=frames.length?frames:legacy.length?legacy:visualSets[pageKey]||visualSets.home;
 const duration=typeof data?.heroDurationMs==="number"?data.heroDurationMs:5200;
 return <figure className="published-media-hero"><ImageSequence frames={sequence} duration={duration}/></figure>;
}
