def projectName = 'ui-tests'
def build_url = "${BUILD_URL}"
def build_number = "${BUILD_NUMBER}"

pipeline {
  agent none
  environment {
    AUTOMATION_ENV = "jenkins_new"
  }
  stages {
    stage('prepare Environment') {
      agent { label 'new-ui-tests' }
      steps {
        script {
          sh("""
            git clone git@github.com:vvorld/automation-getid-web-sdk.git
            cd automation-getid-web-sdk && git checkout change_sdk_builder && cd ..
            docker network create sdk-cluster || true
            docker-compose -p sdk_test_runner -f automation-getid-web-sdk/docker-compose-jenkins.yaml up --build -d
            docker build -f automation-getid-web-sdk/Dockerfile_SDK_BUILD -t sdk_build .
            docker run --rm sdk_build > sdk-server/assets/getid-web-sdk-latest-build.min.js
            docker build -f automation-getid-web-sdk/Dockerfile_test_runner_ci --network sdk-cluster -t test_sdk_runner automation-getid-web-sdk
          """)
        }
      }
    }
    stage('Unit tests') {
      agent { label 'new-ui-tests' }
      steps {
        script {
          sh(
            script:"docker run test_sdk_runner",
            label:"run tests"
          )
        }
      }
    }
  }
  post {
    cleanup {
      node(label: 'new-ui-tests') {
        script {
          sh("""
            docker rm network sdk-cluster || true
            docker rm -f test_sdk_runner || true
            docker rmi -f test_runner || true
            docker rm -f sdk_build || true
            docker rmi -f sdk_build || true
            docker rm -f \$(docker ps -qaf name=sdk_test_runner) || true
          """
          )
          dir("$WORKSPACE/") {
              deleteDir()
          }
        }
      }
    }
  }
}
