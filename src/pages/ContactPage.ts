import { Component } from "@/core/Component";

export class ContactPage extends Component {
  constructor() {
    super();
  }

  template(): string {
    return /*html*/ `
        <section>
            <article class="flex flex-col gap-2">
                <div class="flex py-16 relative">
                    <div class="gradient-title__sub">
                    </div>
                    <h2 class="font-medium text-8xl">About</h2>
                </div>
                <div class="flex flex-col items-end gap-16">
                    <div class="w-1/2  text-left border-b border-gray-600 pb-6">
                        <p class="leading-8">Thank you for taking the time to explore this project. I'm always excited to connect with fellow developers, potential collaborators, and anyone interested in technology.</p>
                    </div>
                    <div class="w-1/2 flex justify-between items-center">
                        <div class="flex flex-col gap-4 text-left">
                            <span class="font-medium">Bloxxom</span>
                            <div class="flex flex-col gap-8 text-sm">
                                <span>Client developer (front end)</span>
                                <div class="flex flex-col gap-1">
                                    <span>Github</span>
                                    <a href="https://github.com/Blossssom" target="_blank">https://github.com/Blossssom</a>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <span>Email</span>
                                    <a href="mailto:eju2003@gmail.com">eju2003@gmail.com</a>
                                </div>
                            </div>
                        </div>
                         <div class="flex flex-col gap-4 text-left">
                            <span class="font-medium">Reo Choi</span>
                            <div class="flex flex-col gap-8 text-sm">
                                <span>Server developer (back end)</span>
                                <div class="flex flex-col gap-1">
                                    <span>Github</span>
                                    <a href="https://github.com/reochoi109" target="_blank">https://github.com/reochoi109</a>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <span>Email</span>
                                    <a href="mailto:reochoi109@gmail.com">reochoi109@gmail.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col items-start gap-16 mt-48 ">
                
                    <div class="w-1/2 text-left flex flex-col gap-4">
                        <p class="font-medium text-2xl">About This Project</p>
                        <p class="leading-8">This is one of my toy projects where I experiment with new technologies and explore creative solutions. I built this to challenge myself and share my learning journey with the community. Every project teaches me something new, and I believe in the power of continuous learning and improvement.</p>
                    </div>
                </div>
                <div class="flex flex-col items-end gap-16 my-48 relative">
                    <div class="gradient-title__sub02">
                    </div>
                    <div class="w-1/2 text-left flex flex-col gap-4">
                        <p class="font-medium text-2xl">A Quick Note</p>
                        <p class="leading-8">While this is a toy project, I put genuine effort into making it functional and well-structured. I believe that even small projects deserve attention to detail and thoughtful implementation. If you're a recruiter or potential employer checking out my work, I hope this demonstrates my commitment to quality and continuous improvement.
Thanks again for stopping by, and I look forward to connecting with you!</p>
                    </div>
                </div>
                
            </article>
        </section>
    `;
  }
}
