import React from 'react';
import Request from 'superagent';
import styled from 'styled-components';
import {UnControlled as CodeMirror} from 'react-codemirror2';
require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');
require('../styles/CodeMirrorOverride.css');

const FileDiffContainer=styled.div`
 padding-top: 20px;
`;
const FileChangeInfo=styled.code`
   margin-left:calc(25% - 33px);
   margin-right:calc(47% - 50px);
   font-weight:bold;
`;

export default class CreatePullRequests extends React.Component{

async componentDidMount(){
     const parsedUrl=new URL(window.location.href);
     const user=this.props.userInfo.userName;
     const repoName=parsedUrl.searchParams.get('repoName');
     const originBranch=parsedUrl.searchParams.get('originBranch');
     const targetUrl='/api/github/'+user+'/'+repoName+'/refs';
     const getBranchResp=await Request.get(targetUrl);
     const repoBranches=getBranchResp.body;
     let gitDiffUrl='';
     repoBranches.map((repoBranch,index)=>{
        if(repoBranch.name == originBranch){
          console.log(repoBranch.commit.sha);
           gitDiffUrl='https://api.github.com/repos/'+user+'/'+repoName+'/commits/'+repoBranch.commit.sha;
            return;
        }
     });
    const result=await Request.get(gitDiffUrl).set('Accept','application/vnd.github.3.diff');
    console.log(result.text);

  }
  render(){
    return(
  <>
  <h4>
   {`Merge feature/PLAT-3635-ASD into Master`}
 </h4>
      <FileDiffContainer>
    <>
       <FileChangeInfo>
         -27,7 +27,7, /client/src/Components/CreateTaskDialog.jsx
       </FileChangeInfo>
      <CodeMirror
        autoCursor={true}
        value={`const parsedUrl=new URL(window.location.href);
        +   const user=this.props.userInfo.userName;
        +   const getBranchResp=await Request.get(targetUrl);
        -   const repoBranches=getBranchResp.body;
        +   return res.status(200).send(ok)
        +  console.log('LOL')`}
      options={{
        mode: 'javascript',
        theme: 'material',
        readOnly:true,
        lineNumbers: true
      }}

      selection={{
        ranges:[{
          anchor:{ch:1,line:1},
          head:{ch:400,line:1}
        },{
          anchor:{ch:1,line:2},
          head:{ch:500,line:2}
        }],
        focus:true
      }}

      onKeyDown={(editor,event)=>{
        event.preventDefault();
      }}
      onContextMenu={(editor,event)=>{
        event.preventDefault();
      }}
      onMouseDown={(editor,event)=>{
        event.preventDefault();
      }}
      onChange={(editor, data, value) => {
        console.log('Uncontrolled');
      }}
     />
         </>
 </FileDiffContainer>
</>
    )
  }
};
