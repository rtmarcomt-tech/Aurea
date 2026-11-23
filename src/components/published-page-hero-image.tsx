import {getPublishedPageContent} from "@/lib/page-content";
import {ImageSequence} from "@/components/image-sequence";
export async function PublishedPageHeroImage({pageKey}:{pageKey:string}){
 const data=await getPublishedPageContent(pageKey);
 if(!data)return null;
 const frames=Array.isArray(data.heroImages)?data.heroImages.flatMap((item)=>{if(!item||typeof item!=="object")return[];const frame=item as {url?:unknown;alt?:unknown};return typeof frame.url==="string"&&frame.url?[{url:frame.url,alt:typeof frame.alt==="string"?frame.alt:""}]:[]}):[];
 const legacy=typeof data.heroImage==="string"&&data.heroImage?[{url:data.heroImage,alt:typeof data.heroImageAlt==="string"?data.heroImageAlt:""}]:[];
 const sequence=frames.length?frames:legacy;
 return sequence.length?<figure className="published-media-hero"><ImageSequence frames={sequence}/></figure>:null;
}