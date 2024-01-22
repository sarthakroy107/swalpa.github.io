import Loading from "@/components/common/Loading"
import { getSpecificProject } from "@/services/serverActions"
import { ProjectCategory } from "@/types/enums.";
import axios from "axios";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react"
const server: string = process.env.NEXT_PUBLIC_API_URL!;

export async function generateStaticParams() {
  const { data } = await axios.get<ProjectType[]>(`${server}/projects`);
  
  if (!data) return [];
  return data.map((project) => ({
    id: project._id,
  }));
}
const Page = async ({ params }: { params: { id: string } }) => {

  const data = await getSpecificProject(params.id);
  
  if (!data) return <Loading />

  return (
    <Suspense fallback={<Loading />}>
      <div className="w-full flex justify-center bg-slate-50 p-2 md:p-5 min-h-[85vh] text-black/80 ">
        <div className="w-full md:w-4/5 lg:w-3/4 lg:min-w-[850px] xl:w-3/5 xl:min-w-[1000px]  bg-white border border-black/10 min-h-screen 
          rounded-sm p-2 lg:p-6 px-4 lg:px-10 lg:text-lg shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px]">
          <h2 className="w-full h2-heading text-xl md:text-2xl lg:text-4xl font-semibold md:p-2" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.project.title) }} />
          <Image src={data.project.image} width={500} height={500} alt="image" className="w-full h-56 md:h-72 lg:h-96 object-contain rounded-sm" />
          <div>
            <p className="text-2xl font-semibold mt-3 mb-1">Description</p>
            <p className="text-justify px-2 text-sm md:text-base text-black text-opacity-75" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.project.description) }} />
          </div>
          <div>
            {
              data.project.informations && data.project.informations.length > 0 && (
                <>
                  <h3 className='text-2xl font-semibold mt-3'>Details</h3>
                  <table className='w-full text-sm lg:text-base lg:w-full lg:ml-3 mt-3 md:mt-5'>
                    <tbody>
                      {
                        data.project.informations.map((inf, index) => (
                          <tr key={index} className={`${index % 2 == 0 ? "bg-[#e4e4e4]" : ""}`}>
                            <td className='p-2'>{inf.name}</td>
                            <td className='p-2 border-l border-black'>{inf.value}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </>
              )
            }
          </div>
          <div className="w-full h-[1px] bg-black/15 mt-5 my-2" />
          <div>
            <h2 className="text-xl lg:text-2xl font-semibold my-2">Publications</h2>
            <ul className="list-disc pl-4 md:pl-5 lg:pl-6 text-sm md:text-base">
              {
                data.publications.map((pub, index) => (
                  <li key={index} className="my-3 md:my-4 lg:my-5 text-black text-opacity-80">
                    <div dangerouslySetInnerHTML={{ __html: 
                      DOMPurify.sanitize((pub.paperLink ?`<a class='hover:text-blue-500 hover:underline' target='_blank' href=${pub.paperLink} >${pub.title}</a>` : pub.title)+ '. ' + pub.authors + '. ' + pub.publisher + ". ")}} />
                </li>
                ))
              }
            </ul>
          </div>
          <div className="w-full h-[1px] bg-black/15 mt-5" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5 px-3 text-base">
            {
              data.project.PI && data.project.PI.name && (
                <div className="border border-black/40 rounded-lg p-4 flex flex-col items-center">
                  <div className="font-medium">{data.project.PI.name}</div>
                  <p className="my-1 text-center text-black text-opacity-60" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.project.PI.designation) }} />
                  <p className="font-semibold">Principal Investigator</p>
                </div>
              )
            }
            {
              data.project.CoPI_1 && data.project.CoPI_1.name && (
                <div className="border border-black/40 rounded-lg p-4 flex flex-col items-center">
                  <div className="font-medium">{data.project.CoPI_1.name}</div>
                  <p className="my-1 text-center text-black text-opacity-60" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.project.CoPI_1.designation) }} />
                  <p className="font-semibold">Co-Principal Investigator {data.project.CoPI_2 && 'I'}</p>
                </div>
              )
            }
            {
              data.project.CoPI_2 && data.project.CoPI_2.name && (
                <div className="border border-black/40 rounded-lg p-4 flex flex-col items-center">
                  <div className="font-medium">{data.project.CoPI_2.name}</div>
                  <p className="my-1 text-center text-black text-opacity-60" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.project.CoPI_2.designation) }} />
                  <p className="font-semibold">Co-Principal Investigator II</p>
                </div>
              )
            }
          </div>
          <div className="w-full h-[1px] bg-black/20 mt-5" />
          <p className="uppercase text-center my-2 font-medium">Sponsored by</p>
          <div className="w-full p-2 flex justify-center pb-3">
            {data.project.category === ProjectCategory.CG && <img src="https://i.ibb.co/7g48NnK/Science-and-Engineering-Research-Board.png" alt="SERB Image" className="h-56 object-contain" />}
            {data.project.category === ProjectCategory.ISRO && <img src="https://i.ibb.co/1Gp83zZ/1200px-Indian-Space-Research-Organisation-Logo-svg.png" alt="ISRO image" className="h-56 object-contain" />}
            {data.project.category === ProjectCategory.WBDST && <img src="https://i.ibb.co/BfVHpCc/Emblem-of-West-Bengal-01.png" alt="WB-DST image" className="h-56 object-contain" />}
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default Page