pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    PORT = "3000"
  }

  stages {
    stage("Build") {
      steps {
        bat "npm install"
      }
    }

    stage("Test") {
      steps {
        bat "npm test"
      }
    }

    stage("Deploy") {
      steps {
        bat """
          set PORT=%PORT%
          start "" /B npm start
          timeout /T 3 /NOBREAK
          powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri 'http://127.0.0.1:%PORT%/health' -UseBasicParsing"
        """
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
