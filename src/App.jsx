import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [githubId, setGithubId] = useState('');
  const [branchCreated, setBranchCreated] = useState(false);

  const handleEnroll = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setGithubId('');
  };

  const handleSubmitGithubId = async () => {
    if (githubId) {
      // Mocking the branch creation
      try {
        const repoOwner = 'your-username'; // Replace with your GitHub username
        const repoName = 'your-repo'; // Replace with your repo name
        const personalAccessToken = 'your-access-token'; // Add your GitHub token

        // Get the default branch (usually 'main') and its SHA
        const branchResponse = await axios.get(
          `https://api.github.com/repos/${repoOwner}/${repoName}/branches/main`,
          {
            headers: {
              Authorization: `token ${personalAccessToken}`,
            },
          }
        );
        const latestCommitSha = branchResponse.data.commit.sha;

        // Create a new branch using the GitHub API
        await axios.post(
          `https://api.github.com/repos/${repoOwner}/${repoName}/git/refs`,
          {
            ref: `refs/heads/${githubId}-branch`,
            sha: latestCommitSha,
          },
          {
            headers: {
              Authorization: `token ${personalAccessToken}`,
            },
          }
        );

        setBranchCreated(true);
        handleCloseModal();
      } catch (error) {
        console.error('Error creating branch:', error);
        alert('Failed to create branch. Check the console for more details.');
      }
    }
  };

  return (
    <div>
      <h1>React Quiz Application</h1>
      <button onClick={handleEnroll}>Enroll in Quiz</button>

      {isModalOpen && (
        <div className="modal">
          <h2>Enter your GitHub ID</h2>
          <input
            type="text"
            placeholder="GitHub ID"
            value={githubId}
            onChange={(e) => setGithubId(e.target.value)}
          />
          <button onClick={handleSubmitGithubId}>Submit</button>
          <button onClick={handleCloseModal}>Cancel</button>
        </div>
      )}

      {branchCreated && <p>Branch created successfully!</p>}
    </div>
  );
};

export default App;
