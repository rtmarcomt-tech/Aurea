export type EditableBlockField="title"|"lead"|"body"|"scope"|"result";
export type EditableBlocks=Record<string,Partial<Record<EditableBlockField,string>>>;
export const serviceBlockFields:[EditableBlockField,string][]=[
 ["title","Nome do serviço"],["lead","Frase de apresentação"],["body","Descrição"],["scope","O serviço pode incluir"],["result","Objetivo"]
];
export function applyServiceBlockOverrides<T extends [string,string,string,string,string,string]>(items:T[],blocks:EditableBlocks|undefined):T[]{
 if(!blocks)return items;
 return items.map(item=>{
  const prefix="service."+item[0]+".";
  const next=[...item] as T;
  const fields:EditableBlockField[]=["title","lead","body","scope","result"];
  fields.forEach((field,index)=>{const value=blocks[prefix+field];if(typeof value==="string")next[index+1]=value as T[number]});
  return next;
 });
}
