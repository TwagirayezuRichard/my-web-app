pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    IMAGE_NAME = "jenkins-web-app"
    CONTAINER_NAME = "jenkins-web-app"
    HOST_PORT = "3001"
    CONTAINER_PORT = "3000"
  }

  stages {
    stage("Build") {
      steps {
        bat "npm ci"
      }
    }

    stage("Test") {
      steps {
        bat "npm test"
      }
    }

    stage("Docker Build") {
      steps {
        bat 'docker build --tag %IMAGE_NAME%:%BUILD_NUMBER% .'
      }
    }

    stage("Publish") {
      steps {
        withCredentials([usernamePassword(
          credentialsId: "dockerhub-creds",
          usernameVariable: "DOCKERHUB_USER",
          passwordVariable: "DOCKERHUB_TOKEN"
        )]) {
          bat """
            @echo off
            echo %DOCKERHUB_TOKEN%| docker login --username "%DOCKERHUB_USER%" --password-stdin
            if errorlevel 1 exit /b 1
            docker tag %IMAGE_NAME%:%BUILD_NUMBER% %DOCKERHUB_USER%/%IMAGE_NAME%:%BUILD_NUMBER%
            if errorlevel 1 exit /b 1
            docker push %DOCKERHUB_USER%/%IMAGE_NAME%:%BUILD_NUMBER%
            if errorlevel 1 exit /b 1
            docker logout
          """
        }
      }
    }

    stage("Deploy") {
      steps {
        bat '''
          @echo off
          powershell -NoProfile -ExecutionPolicy Bypass -Command "$existing = docker container inspect %CONTAINER_NAME% 2>$null; if ($LASTEXITCODE -eq 0) { docker rm --force %CONTAINER_NAME%; if ($LASTEXITCODE -ne 0) { exit 1 } }"
          if errorlevel 1 exit /b 1
          docker run --detach --name %CONTAINER_NAME% --publish %HOST_PORT%:%CONTAINER_PORT% %IMAGE_NAME%:%BUILD_NUMBER%
          if errorlevel 1 exit /b 1
          powershell -NoProfile -ExecutionPolicy Bypass -Command "$healthy = $false; for ($attempt = 0; $attempt -lt 10; $attempt++) { try { $response = Invoke-WebRequest -Uri 'http://127.0.0.1:%HOST_PORT%/health' -UseBasicParsing -TimeoutSec 2; if ($response.StatusCode -eq 200) { $healthy = $true; break } } catch { Start-Sleep -Seconds 1 } }; if (-not $healthy) { docker logs %CONTAINER_NAME%; exit 1 }"
        '''
      }
    }
  }

  post {
    success {
      echo "Build, tests, and deployment completed successfully."
    }
    failure {
      echo "The pipeline failed. Check the Jenkins Console Output."
    }
  }
}
