import {prisma} from "@/lib/prisma";
export type EditablePageContent={title?:string;intro?:string;heroImage?:string;heroImageAlt?:string;sections?:Array<{heading?:string;body?:string;items?:string[];imageUrl?:string;imageAlt?:string}>};
export async function getPublishedPageContent(key:string){try{const page=await prisma.page.findUnique({where:{key},select:{publishedContent:true}});return page?.publishedContent as EditablePageContent|null;}catch{return null;}}
