def projectName = 'ui-tests'
def build_url = "${BUILD_URL}"
def build_number = "${BUILD_NUMBER}"
def build_branch = "${BRANCH_NAME}"
def unique_pattern_name = "${BUILD_NUMBER}-${BRANCH_NAME}"
def unique_pattern = unique_pattern_name.replace("/", "")


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
          sh(
            script:"git clone git@github.com:vvorld/automation-getid-web-sdk.git",
            label:"clone tests repo"
          )
          sh(
            script:"docker network create sdk-cluster || true",
            label:"network creation"
          )
          sh(
            script:"docker build -f automation-getid-web-sdk/Dockerfile_SDK_BUILD -t sdk_build-${unique_pattern} .",
            label:"build sdk"
          )
          sh(
            script:"mkdir automation-getid-web-sdk/sdk-server/assets && docker run --rm sdk_build-${unique_pattern} > automation-getid-web-sdk/sdk-server/assets/getid-web-sdk-latest-build.min.js",
            label:"getting sdk.min.js"
          )
          sh(
            script:"docker-compose -p sdk_test_runner-${unique_pattern} -f automation-getid-web-sdk/docker-compose-jenkins.yaml up --build -d",
            label:"app selenium and sdk-server"
          )
          sh(
            script:"cd automation-getid-web-sdk && docker build -f Dockerfile_test_runner_ci -t test_sdk_runner-${unique_pattern} .",
            label:"build test_runner"
          )
        }
      }
    }
    stage('Unit tests') {
      agent { label 'new-ui-tests' }
      steps {
        script {
          sh(
            script:"pwd && docker run --network sdk-cluster -v automation-getid-web-sdk:/automation test_sdk_runner-${unique_pattern}",
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
            docker rm -f test_sdk_runner-${unique_pattern} || true
            docker rmi -f \$(docker images --format {{.Repository}} | grep ${unique_pattern}) || true
            docker rm -f sdk_build--${unique_pattern} || true
            docker rmi -f \$(docker images --format {{.Repository}} | grep ${unique_pattern}) || true
            docker rm -f \$(docker ps -qaf name=${unique_pattern}) || true
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
