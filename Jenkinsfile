pipeline {
    agent any

    environment {
        IMAGE_NAME = "devstack/pos-api"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/it22639080/pos-app.git',
                    credentialsId: 'github-creds'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $IMAGE_NAME:$IMAGE_TAG ."
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh "echo $PASS | docker login -u $USER --password-stdin"
                }
            }
        }

        stage('Push Image') {
            steps {
                sh "docker push $IMAGE_NAME:$IMAGE_TAG"
            }
        }

        stage('Update K8s Manifests Repo') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/it22639080/pos-api-k8s.git',
                    credentialsId: 'github-creds'

                sh """
                sed -i 's|image: .*|image: $IMAGE_NAME:$IMAGE_TAG|' deployment.yaml
                git add deployment.yaml
                git commit -m "Update image to $IMAGE_TAG"
                git push origin main
                """
            }
        }
    }
}
