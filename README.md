# Web application practicals

This repository contains the Jenkins, Docker, Kubernetes, and GitHub Actions practicals.

## Kubernetes with Minikube

The Deployment runs two application replicas. The Service exposes port `80` and uses NodePort `30007`.

1. Start Docker Desktop.
2. Start Minikube with the Docker driver:

   ```powershell
   minikube start --driver=docker
   ```

3. Build and load the application image into Minikube:

   ```powershell
   docker build -t jenkins-web-app:kubernetes .
   minikube image load jenkins-web-app:kubernetes
   ```

4. Apply the manifests and wait for both replicas:

   ```powershell
   kubectl apply -f deployment.yaml
   kubectl apply -f service.yaml
   kubectl rollout status deployment/my-web-app
   kubectl get pods,services
   ```

5. Open the application:

   ```powershell
   minikube service my-web-app --url
   ```

   The page should say `Hello, Kubernetes!`. The `/health` endpoint should return `{"status":"ok"}`.

## GitHub Actions release

The release workflow at `.github/workflows/release.yml` runs when a version tag such as `v1.0.0` is pushed. It installs dependencies, runs tests, builds and publishes the image to GitHub Container Registry, then creates a GitHub Release with generated notes.

1. Push the workflow and application changes to the repository's default branch.
2. In GitHub, open **Settings → Actions → General** and make sure Actions are enabled. The workflow requests `contents: write` and `packages: write` using the repository-provided `GITHUB_TOKEN`; no token needs to be committed or added as a secret.
3. Create and push a version tag:

   ```powershell
   git tag v1.0.0
   git push origin v1.0.0
   ```

4. Follow the run under the repository's **Actions** tab. On success, check **Releases** and the `ghcr.io/twagirayezurichard/my-web-app` package.
