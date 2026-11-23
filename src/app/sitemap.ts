import type {MetadataRoute} from "next";
const baseUrl=(process.env.APP_URL||"http://localhost:3000").replace(/\/$/,"");
export default function sitemap():MetadataRoute.Sitemap{
 const now=new Date();
 return [
  {url:baseUrl, lastModified:now, changeFrequency:"monthly",priority:1},
  {url:`${baseUrl}/servicos`,lastModified:now,changeFrequency:"monthly",priority:0.8},
  {url:`${baseUrl}/servicos/b2b`,lastModified:now,changeFrequency:"monthly",priority:0.9},
  {url:`${baseUrl}/servicos/creators`,lastModified:now,changeFrequency:"monthly",priority:0.9},
  {url:`${baseUrl}/contactos`,lastModified:now,changeFrequency:"yearly",priority:0.6}
 ];
}
